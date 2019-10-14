import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .integer()
        .required(),
      height: Yup.number()
        .positive()
        .integer()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation Error' });
    }

    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExist) {
      return res.status(400).json({ error: 'Email already being used' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .integer(),
      height: Yup.number()
        .positive()
        .integer(),
      weight: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error' });
    }

    const { id, email } = req.body;

    const student = await Student.findByPk(id);

    if (email) {
      if (email !== student.email) {
        const studentExist = await Student.findOne({ where: { email } });
        if (studentExist) {
          return res.status(400).json({ error: 'Email already being used' });
        }
      }
    }

    const upStudent = await student.update(req.body);

    return res.json(upStudent);
  }
}

export default new StudentController();
