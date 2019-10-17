import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Queue from '../../lib/Queue';
import AnsweredOrdersMail from '../jobs/AnsweredOrdersMail';
import Student from '../models/Student';

class HelpOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string()
        .min(5)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Error.' });
    }

    const student_id = req.params.studentId;

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const student_id = req.params.studentId;

    const questions = await HelpOrder.findAll({
      where: {
        student_id,
      },
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'student_id', 'question', 'answer', 'answer_at'],
    });

    return res.json(questions);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string()
        .min(5)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Error.' });
    }
    const helpOrder_id = req.params.helpOrderId;

    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(helpOrder_id);

    await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    console.log(helpOrder.student_id);

    await Queue.add(AnsweredOrdersMail.key, {
      student: await Student.findByPk(helpOrder.student_id),
      helpOrder,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
