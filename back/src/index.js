import initializeDatabase from './database/question'
import { authenticateUser, logout, isLoggedIn } from './auth'



import app from './app'
const start = async () => {
  const controller = await initializeDatabase();

  app.get("/", (req, res, next) => res.send("ok"));

   // CREATE
   app.get("/question/add",isLoggedIn, async (req, res, next) => {
    try {
      const { question_title , question_type ,question_data,survey_id } = req.query;
      const {sub: auth0_sub} = req.user;
      //const auth0_sub = sub;
      const result = await controller.createQuestion({ question_title,question_type,question_data, auth0_sub,survey_id });
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
  app.get("/questions/delete/:id",isLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await controller.deleteQuestion(id);
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // UPDATE
  app.get("/questions/update/:id",isLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { question_title,question_type,question_data } = req.query;
      const {sub: auth0_sub} = req.user;
      const result = await controller.updateQuestion(id, { question_title,question_type,question_data,auth0_sub });
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
  app.get("/answer/add", isLoggedIn, async (req, res, next) => {
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
  app.get("/answer/delete/:id", isLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await controller.deleteAnswer(id);
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });

  // UPDATE answer
  app.get("/answers/update/:id", isLoggedIn, async (req, res, next) => {
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
  //create User 
  app.get("/user/add", isLoggedIn, async (req, res, next) => {
    try {
      const { user_name,auth0_sub } = req.query;
      const result = await controller.createUser({ auth0_sub,user_name  });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });
  //All useres
  app.get("/users/list", async (req, res, next) => {
    try {
      const { order } = req.query;
      const answers = await controller.getUsersList(order);
      res.json({ success: true, result: answers });
    } catch (e) {
      next(e);
    }
  });
  //create survey
  app.get("/survey/add", isLoggedIn, async (req, res, next) => {
    try {
      const { survey_name } = req.query;
      const {sub: auth0_sub} = req.user;
      const result = await controller.createSurvey({ survey_name,auth0_sub  });
      res.json({ success: true, result });
    } catch (e) {
      next(e);
    }
  });
  //All surveys
  app.get("/surveys/list", async (req, res, next) => {
    try {
      const { order } = req.query;
      const answers = await controller.getSurveysList(order);
      res.json({ success: true, result: answers });
    } catch (e) {
      next(e);
    }
  });
  //inner join (questions and survey)
  app.get("/inner/survey", async (req, res, next) => {
    try {
      const { order } = req.query;
      const answers = await controller.innerQuestionsAnswers(order);
      res.json({ success: true, result: answers });
    } catch (e) {
      next(e);
    }
  });
  //inner join (questions and answers)
  app.get("/inner/question", async (req, res, next) => {
    try {
      const { order } = req.query;
      const answers = await controller.innerQuestionsAnswers(order);
      res.json({ success: true, result: answers });
    } catch (e) {
      next(e);
    }
  });

  //Auth 
  app.get('/mypage', isLoggedIn, async ( req, res, next ) => {
    try{
      const { order, desc, limit, start } = req.query;
      const { sub: auth0_sub, user_name} = req.user
      const user = await controller.createUserIfNotExists({auth0_sub, user_name})
      const contacts = await controller.getQuestionList({order, desc, limit, start, author_id:auth0_sub})
      user.contacts = contacts
      res.json({ success: true, result: user });
    }catch(e){
      next(e)
    }
  })

//getQuestionsBySurvey
app.get("/survey/questions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await controller.getQuestionsBySurvey(id);
    res.json({ success: true, result: question });
  } catch (e) {
    next(e);
  }
});
//inner (survey question)
  // ERROR
  app.use((err, req, res, next) => {
    console.error(err)
    const message = err.message
    res.status(500).json({ success:false, message })
  })
  
  app.listen(8080, () => console.log("server listening on port 8080"));
};

start();