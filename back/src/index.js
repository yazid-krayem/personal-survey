import initializeDatabase from './database/question'
import app from './app'
const start = async () => {
  const controller = await initializeDatabase();

  app.get("/", (req, res, next) => res.send("ok"));

  // CREATE question
  app.get("/question/add", async (req, res, next) => {
    try {
      const { question } = req.query;
      const result = await controller.createQuestion({ question });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // READ question
  
  app.get("/questions/get/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const question = await controller.getQuestion(id);
      res.json({ success: true, result: question });
    } catch (e) {
      next(e);
    }
  });



  // DELETE question
  app.get("/questions/delete/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await controller.deleteQuestion(id);
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // UPDATE question
  app.get("/questions/update/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { Title } = req.query;
      const result = await controller.updateQuestion(id, { Title });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // LIST question
  app.get("/questions/list", async (req, res, next) => {
    try {
      const { order } = req.query;
      const questions = await controller.getQuestionList(order);
      res.json({ success: true, result: questions });
    } catch (e) {
      next(e);
    }
  });
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////
//////////////////////////////////////

  // CREATE answer
  app.get("/answer/new", async (req, res, next) => {
    try {
      const { answer } = req.query;
      const result = await controller.createAnswer({ answer });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // READ question
  
  app.get("/answer/get/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const question = await controller.getAnswer(id);
      res.json({ success: true, result: question });
    } catch (e) {
      next(e);
    }
  });



  // DELETE answer
  app.get("/answer/delete/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await controller.deleteAnswer(id);
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // UPDATE answer
  app.get("/answers/update/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { text } = req.query;
      const result = await controller.updateAnswer(id, { text });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // LIST answer
  app.get("/answers/list", async (req, res, next) => {
    try {
      const { order } = req.query;
      const answers = await controller.getAnswerList(order);
      res.json({ success: true, result: answers });
    } catch (e) {
      next(e);
    }
  });
  // ERROR
  app.use((err, req, res, next) => {
    console.error(err)
    const message = err.message
    res.status(500).json({ success:false, message })
  })
  
  app.listen(8080, () => console.log("server listening on port 8080"));
};

start();