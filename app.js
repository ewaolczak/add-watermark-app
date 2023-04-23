const Jimp = require('jimp');
const inquirer = require('inquirer');

const addTextWatermarkToImage = async function (inputFile, outputFile, text) {
  const image = await Jimp.read(inputFile);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const textData = {
    text: text,
    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
  };
  image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
  await image.quality(100).writeAsync(outputFile);
};

const addImageWatermarkToImage = async function (
  inputFile,
  outputFile,
  watermarkFile
) {
  const image = await Jimp.read(inputFile);
  const watermark = await Jimp.read(watermarkFile);
  const x = image.getWidth() / 2 - watermark.getWidth() / 2;
  const y = image.getHeight() / 2 - watermark.getHeight() / 2;
  image.composite(watermark, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacitySource: 0.5
  });
  await image.quality(100).writeAsync(outputFile);
};

const prepareOutputFilename = (filename) => {
  const [name, ext] = filename.split('.');
  return `${name}-with-watermark.${ext}`;
};

const startApp = async () => {
  // Ask if user is ready
  const answer = await inquirer.createPromptModule([
    {
      name: 'start',
      message:
        'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
      type: 'confirm'
    }
  ]);

  // if answer is no, just quit the app
  if (!answer.start) process.exit();

  // ask about input file and watermark type
  const option = await inquirer.createPromptModule([
    {
      name: 'inputImage',
      type: 'input',
      message: 'What file do you want to mark',
      defautl: 'test.jpg'
    },
    {
      name: 'watermarkType',
      type: 'list',
      choices: ['Text watermark', 'Image watermark']
    }
  ]);

  // Ask about watermark text
  if (options.watermarkType === 'Text watermark') {
    const text = await inquirer.createPromptModule([
      {
        name: 'value',
        type: 'input',
        message: 'Type watermark text:'
      }
    ]);
    options.watermarkText = text.value;
    // Run addTextWatermarkToImage function
    addTextWatermarkToImage(
      './img/' + options.inputImage,
      prepareOutputFilename(options.inputImage) + options.watermarkText
    );
  }

  // Ask about watermark file
  else {
    const image = await inquirer.createPromptModule([
      {
        name: 'filename',
        type: 'input',
        message: 'Type your watermak name:',
        default: 'logo.png'
      }
    ]);
    options.watermarkImage - image.filename;
    // Run addImageWatermarkToImage function
    addImageWatermarkToImage(
      './img/' + options.inputImage,
      prepareOutputFilename(options.inputImage) + options.watermarkImage
    );
  }
};

startApp();
