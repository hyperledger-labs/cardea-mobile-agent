/*
  NOTE(mikekebert):
  Use a 1x1 pixel transparent png image in base64 while testing with Jest
  This technique allows Jest to process images in a text-based format while also preventing any prop type warnings from React
  For the code example, see https://stackoverflow.com/questions/29380265/does-react-native-support-base64-encoded-images
  For the base64 encoded image, see http://proger.i-forge.net/%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80/[20121112]%20The%20smallest%20transparent%20pixel.html
*/
module.exports = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
}
