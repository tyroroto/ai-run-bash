
let currentDir = '.'
async function main() {
  // let result = `create nodejs project with hello world log, project will name tt2.`;
  let result = `clone https://github.com/tyroroto/delete-mysql-records, this project can use to delete mysql records, please clone and set env to
  host="127.0.0.1"
user="root"
password="pswd"
database="db"
port=3306

startId=1
endId=1000000
deleteCount=1000
tableName="table"
`;
  // let result = `run index.js in project tt2`
  // let result = `create new nodejs project, that have function to get random repo info from github api, project will name tt4.`;
  // let result = `create new nodejs project,
  // - that will serve http server.
  // - this project will implement api to check Thai citizen id is correct format.
  // - project will name api22.
  // `;


  while (result !== ':exit') {
    result = await sendCommand(result)
    console.log('-----------------------')
  }
}

async function sendCommand(input: string) {
  const response = await fetch("http://localhost:3000/command", {
    method: "POST",
    body: JSON.stringify({
      content: input
    }),
    headers: { "Content-Type": "application/json" },
  });
  let responseMessage = ':next';
  const body: any = await response.json();
  console.log(body.output.message.content)
  const content = body.output.message.content;
  if (body.output.message.content.includes(':exit')) {
    return ':exit';
  }
  if (body.output.message.content.includes(':tm')) {

    if (body.output.message.content.includes(':tm echo')) {
      const text = content.substring(9, content.length);
      // find last index of '>'
      let substringCount = 3;
      let index = text.lastIndexOf('>>');
      if(index < 0) {
       index = text.lastIndexOf('>');
       substringCount =2;
      }
      console.log('currentDir', currentDir)
      console.log('text', text)
      const path = currentDir + '/' + text.substring(index + substringCount, text.length);
      console.log('path', path)
      // remove " from text, at first and last char of string if exist
      let textWithoutQuote = text
      if(text.indexOf('\n') > 0 && ( text[0] === '"' || text[0] === '\'') ) {
         textWithoutQuote = text.substring(1, index - 2 );
      }

      if(text.indexOf('\"') < 2 ) {
        textWithoutQuote = text.substring(1, index - 2 );
     }
      console.log('textWithoutQuote', textWithoutQuote)

      
      await Bun.write(path, textWithoutQuote);
      console.log('responseMessage', responseMessage)
      return responseMessage;
    }

    if (body.output.message.content.includes(':tm cd')) {
      const command = content.substring(7, content.length);
      console.log('command', command)
      currentDir = command;
      const { stdout, stderr } = Bun.spawn(['ls', '-al'], { cwd: currentDir });
      const stdoutStr = await new Response(stdout).text();
      const stderrStr = await new Response(stderr).text();
      console.log("STDOUT:", stdoutStr, ", STDERR:", stderrStr);
      // console.log(body)
      if (stdoutStr.length > 0) {
        responseMessage = 'STDOUT:' + stdoutStr + ' STDERR: ' + stderrStr;
      }
      console.log('responseMessage', responseMessage)
      return responseMessage;
    } else {
      const command = content.substring(4, content.length);
      console.log('currentDir', currentDir)
      console.log('command', command)
      const { stdout, stderr } = Bun.spawn([...command.split(' ')], { cwd: currentDir });
      const stdoutStr = await new Response(stdout).text();
      const stderrStr = await new Response(stderr).text();
      console.log("STDOUT:", stdoutStr, ", STDERR:", stderrStr);
      // console.log(body)
      if (stdoutStr.length > 0) {
        responseMessage = 'STDOUT:' + stdoutStr + ' STDERR: ' + stderrStr;
      }
      console.log('responseMessage', responseMessage)
      return responseMessage;
    }

  }


  console.log('responseMessage-normal', responseMessage)
  return responseMessage;
}

main();