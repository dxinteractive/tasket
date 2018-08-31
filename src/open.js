var {exec} = require('child_process');
export default ({filepath}) => exec(`subl ${filepath}`);