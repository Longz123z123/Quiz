import { useEffect, useState } from 'react';
import Select from 'react-select';
import './Question.scss';
import { v4 as uuidv4 } from 'uuid';
import { BsFillPatchPlusFill, BsFillPatchMinusFill } from 'react-icons/bs';
import { RiImageAddFill } from 'react-icons/ri';
import _ from 'lodash';
import Lightbox from 'react-awesome-lightbox';
import { toast } from 'react-toastify';
import {
  getAllQuizForAdmin,
  postCreateNewAnswerForQuestion,
  postCreateNewQuestionForQuiz,
} from '../../../../services/apiServices';
////////////
const Questions = (props) => {
  const [listQuiz, setListQuiz] = useState([]);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    let res = await getAllQuizForAdmin();
    if (res && res.EC === 0) {
      let newQuiz = res.DT.map((item) => {
        return {
          value: item.id,
          label: `${item.id} - ${item.description}`,
        };
      });
      setListQuiz(newQuiz);
    }
  };

  const [selectedQuiz, setSelectedQuiz] = useState({});

  const initQuestions = [
    {
      id: uuidv4(),
      description: '',
      imageFile: '',
      imageName: '',

      answers: [{ id: uuidv4(), description: '', isCorrect: false }],
    },
  ];

  const [questions, setQuestions] = useState(initQuestions);

  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [dataImagePreview, setDataImagePreview] = useState({
    title: '',
    url: '',
  });
  ///

  const handleAddRemoveQuestion = (type, id) => {
    if (type === 'Add') {
      const newQuestion = {
        id: uuidv4(),
        description: '',
        imageFile: '',
        imageName: '',

        answers: [{ id: uuidv4(), description: '', isCorrect: false }],
      };
      setQuestions([...questions, newQuestion]);
    }
    if (type === 'Remove') {
      let questionsClone = _.cloneDeep(questions);
      questionsClone = questionsClone.filter((item) => item.id !== id);
      setQuestions(questionsClone);
    }
  };

  const handleAddRemoveAnswer = (type, questionsId, answerId) => {
    let questionsClone = _.cloneDeep(questions);

    if (type === 'Add') {
      const newAnswer = { id: uuidv4(), description: '', isCorrect: false };
      let index = questionsClone.findIndex((item) => item.id === questionsId);
      questionsClone[index].answers.push(newAnswer);
      setQuestions(questionsClone);
    }

    if (type === 'Remove') {
      let index = questionsClone.findIndex((item) => item.id === questionsId);
      questionsClone[index].answers = questionsClone[index].answers.filter(
        (item) => item.id !== answerId
      );
      setQuestions(questionsClone);
    }
  };

  const handleOnChange = (type, questionId, value) => {
    if (type === 'QUESTION') {
      let questionsClone = _.cloneDeep(questions);
      let index = questionsClone.findIndex((item) => item.id === questionId);
      if (index > -1) {
        questionsClone[index].description = value;
        setQuestions(questionsClone);
      }
    }
  };
  const handleOnChangeFileQuestion = (questionId, event) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1 && event.target && event.target.files && event.target.files[0]) {
      questionsClone[index].imageFile = event.target.files[0];
      questionsClone[index].imageName = event.target.files[0].name;

      setQuestions(questionsClone);
    }
  };
  const handleAnswerQuestion = (type, questionId, answerId, value) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      questionsClone[index].answers = questionsClone[index].answers.map((answer) => {
        if (answer.id === answerId) {
          if (type === 'CHECKBOX') {
            answer.isCorrect = value;
          }
          if (type === 'INPUT') {
            answer.description = value;
          }
        }
        return answer;
      });
      setQuestions(questionsClone);
    }
  };
  const handleSubmitQuestionForQuiz = async () => {
    //validate data
    if (_.isEmpty(selectedQuiz)) {
      toast.error('Please choose a Quiz!');
      return;
    }

    //validate answer
    let isValidAnswer = true;
    let indexQ = 0;
    let indexA = 0;
    for (let i = 0; i < questions.length; i++) {
      for (let j = 0; j < questions[i].answers.length; j++) {
        if (!questions[i].answers[j].description) {
          isValidAnswer = false;
          indexA = j;
          break;
        }
      }
      indexQ = i;
      if (isValidAnswer === false) break;
    }
    if (isValidAnswer === false) {
      toast.error(`Not empty Answer ${indexA + 1} at Question ${indexQ + 1}`);
      return;
    }
    //validate question
    let isValidQ = true;
    let indexQ1 = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].description) {
        isValidQ = false;
        indexQ1 = i;
        break;
      }
    }
    if (isValidQ === false) {
      toast.error(`Not empty description for Question ${indexQ1 + 1}`);
      return;
    }

    // //submit ques
    for (const question of questions) {
      const q = await postCreateNewQuestionForQuiz(
        +selectedQuiz.value,
        question.description,
        question.imageFile
      );
      // //submit answer
      for (const answer of question.answers) {
        await postCreateNewAnswerForQuestion(answer.description, answer.isCorrect, q.DT.id);
      }
    }
    toast.success('Create question and answer succcess!');
    setQuestions(initQuestions);
  };

  // //submit ques
  // await Promise.all(
  //   questions.map(async (question) => {
  //     const q = await postCreateNewQuestionForQuiz(
  //       +selectedQuiz.value,
  //       question.description,
  //       question.imageFile
  //     );
  //     //submit answer
  //     await Promise.all(
  //       question.answers.map(async (answer) => {
  //         await postCreateNewAnswerForQuestion(answer.description, answer.isCorrect, q.DT.id);
  //       })
  //     );
  //   })
  // );

  const handlePreviewImage = (questionId) => {
    let questionsClone = _.cloneDeep(questions);
    let index = questionsClone.findIndex((item) => item.id === questionId);
    if (index > -1) {
      setDataImagePreview({
        url: URL.createObjectURL(questionsClone[index].imageFile),
        title: questionsClone[index].imageName,
      });
      setIsPreviewImage(true);
    }
  };

  ///////////
  return (
    <div className="question-container ">
      <div className="title"> Manage Questions</div>
      <hr></hr>
      <div className="add-new-question">
        <div className="col-6 form-group">
          <label className="mb-2">Select Quiz: </label>
          <Select value={selectedQuiz} onChange={setSelectedQuiz} options={listQuiz} />
        </div>

        <div className="mt-3 mb-2">Add question</div>
        {questions &&
          questions.length > 0 &&
          questions.map((question, index) => {
            return (
              <div key={question.id} className="q-main mb-4">
                <div className="question-content">
                  <div className="form-floating description">
                    <input
                      type="email"
                      className="form-control"
                      placeholder=""
                      value={question.description}
                      onChange={(event) =>
                        handleOnChange('QUESTION', question.id, event.target.value)
                      }
                    />
                    <label>Question {index + 1} 's Description</label>
                  </div>
                  <div className="group-upload">
                    <label htmlFor={`${question.id}`}>
                      <RiImageAddFill className="label-up" />
                    </label>
                    <input
                      id={`${question.id}`}
                      onChange={(event) => handleOnChangeFileQuestion(question.id, event)}
                      type={'file'}
                      hidden
                    />
                    <span>
                      {question.imageName ? (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePreviewImage(question.id)}
                        >
                          {question.imageName}
                        </span>
                      ) : (
                        '0 file is uploaded'
                      )}
                    </span>
                  </div>
                  <div className="btn-add">
                    <span onClick={() => handleAddRemoveQuestion('Add', '')}>
                      <BsFillPatchPlusFill className="icon-add" />
                    </span>
                    {questions.length > 1 && (
                      <span onClick={() => handleAddRemoveQuestion('Remove', question.id)}>
                        <BsFillPatchMinusFill className="icon-remove" />
                      </span>
                    )}
                  </div>
                </div>
                {question.answers &&
                  question.answers.length > 0 &&
                  question.answers.map((answer, index) => {
                    return (
                      <div key={answer.id} className="answer-content">
                        <input
                          className="form-check-input isCorrect"
                          type="checkbox"
                          checked={answer.isCorrect}
                          onChange={(event) =>
                            handleAnswerQuestion(
                              'CHECKBOX',
                              question.id,
                              answer.id,
                              event.target.checked
                            )
                          }
                        />
                        <div className="form-floating answer-name">
                          <input
                            value={answer.description}
                            type="email"
                            className="form-control"
                            onChange={(event) =>
                              handleAnswerQuestion(
                                'INPUT',
                                question.id,
                                answer.id,
                                event.target.value
                              )
                            }
                          />
                          <label>Answer {index + 1}</label>
                        </div>
                        <div className="btn-group">
                          <span onClick={() => handleAddRemoveAnswer('Add', question.id)}>
                            <BsFillPatchPlusFill className="icon-add" />
                          </span>
                          {question.answers.length > 1 && (
                            <span
                              onClick={() =>
                                handleAddRemoveAnswer('Remove', question.id, answer.id)
                              }
                            >
                              <BsFillPatchMinusFill className="icon-remove" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        {questions && questions.length > 0 && (
          <div>
            <button onClick={() => handleSubmitQuestionForQuiz()} className="btn btn-warning">
              Save Question
            </button>
          </div>
        )}
        {isPreviewImage === true && (
          <Lightbox
            image={dataImagePreview.url}
            title={dataImagePreview.title}
            onClose={() => setIsPreviewImage(false)}
          ></Lightbox>
        )}
      </div>
    </div>
  );
};

export default Questions;
