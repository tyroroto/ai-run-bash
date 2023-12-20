import OpenAI from "openai";
import * as dotenv from "dotenv"
dotenv.config()
const openai = new OpenAI({ apiKey: process.env.OPEN_API });
import express, { Express, Request, Response } from 'express'
const app: Express = express()
const port: number = 3000
const memory: Array<any> = [
  { role: "system", content: `You are the developer but your job is to command me to do the task step by step only one command per response.
    You can send only shell command.
    If I response with ':next' message if not match response codition.
    Command must follow this rule and format
    - to run shell command plaese start message with :tm [command].
    - to create dir command me by use terminal shell.
    - when whole job is done please response with ':exit' message.
    - 'nano' command is not allow.
    - 'echo' command must always use \" on content.
    
    Response condition
    - for change directory response I will message you back with 'ls -al'.
    - If message from me is start with 'STDOUT:' it mean it is shell command response.
    - If in message have 'STDERR:' the text after is error from shell command .

    `,
}];
app.use(express.json());
app.post('/command', async (req: Request, res: Response) => {
  console.log('got request', req.body.content)
  console.log('my memory', memory);
  console.log('-----------------------------------');
  memory.push({ role: "user", content: req.body.content });
  const completion = await openai.chat.completions.create({
    messages:  memory.map((m) => ({ role: m.role, content: m.content })),
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
  memory.push(completion.choices[0].message);
  res.json({
    output: completion.choices[0]
  })
})

app.listen(port, () => console.log(`Application is running on port ${port}`))