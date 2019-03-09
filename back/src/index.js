import initializeDatabase from './database/question'
import { authenticateUser, logout, isLoggedIn } from './auth'



import app from './app'
const start = async () => {
  const controller = await initializeDatabase();

  app.get("/", (req, res, next) => res.send("ok"));

   // CREATE
   app.get("/question/add", async (req, res, next) => {
    try {
      const { question_title , question_type ,question_data } = req.query;
      const result = await controller.createQuestion({ question_title,question_type,question_data });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // READ
  app.get("/questions/get/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const question = await controller.getQuestion(id);
      res.json({ success: true, result: question });
    } catch (e) {
      next(e);
    }
  });

  // DELETE
  app.get("/questions/delete/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await controller.deleteQuestion(id);
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // UPDATE
  app.get("/questions/update/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const { question_title,question_type,question_data } = req.query;
      const result = await controller.updateQuestion(id, { question_title,question_type,question_data });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // LIST
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
  app.get("/answer/add", async (req, res, next) => {
    try {
      const { question_id, answer_text,user_id } = req.query;
      const result = await controller.createAnswer({ answer_text,question_id,user_id  });
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

  //inner join 
  app.get("/inner", async (req, res, next) => {
    try {
      const { order } = req.query;
      const answers = await controller.innerQuestionsAnswers(order);
      res.json({ success: true, result: answers });
    } catch (e) {
      next(e);
    }
  });
  //Auth 
  app.get('/mypage', isLoggedIn, ( req, res ) => {
    const username = req.user.name
    res.send({success:true, result: 'ok, user '+username+' has access to this page'})
  })


  // ERROR
  app.use((err, req, res, next) => {
    console.error(err)
    const message = err.message
    res.status(500).json({ success:false, message })
  })
  
  app.listen(8080, () => console.log("server listening on port 8080"));
};

start();