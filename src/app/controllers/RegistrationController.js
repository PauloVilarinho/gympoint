import { parseISO, startOfDay, isBefore } from 'date-fns';
import * as Yup from 'yup';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .integer()
        .required(),
      student_id: Yup.number()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error.' });
    }

    const { plan_id, student_id } = req.body;

    const planExist = await Plan.findByPk(plan_id);

    if (!planExist) {
      return res.status(401).json({ error: 'Plan does not exist.' });
    }

    const studentExist = await Student.findByPk(student_id);

    if (!studentExist) {
      return res.status(401).json({ error: 'Student does not exist.' });
    }

    const start_date = startOfDay(parseISO(req.body.start_date));

    const today = startOfDay(new Date());

    if (isBefore(start_date, today)) {
      return res
        .status(401)
        .json({ error: "It's not possible to start before today" });
    }

    const registration = await Registration.create({
      plan_id,
      student_id,
      start_date,
    });

    await Queue.add(RegistrationMail.key, {
      registration,
      student: studentExist,
      plan: planExist,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().integer(),
      student_id: Yup.number().integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error.' });
    }

    const registration_id = req.params.registrationId;

    const registration = await Registration.findByPk(registration_id);

    if (!registration) {
      return res.status(401).json({ error: 'Registration does not exist.' });
    }

    const { student_id, plan_id } = req.body;

    if (student_id) {
      const studentExist = await Student.findByPk(student_id);

      if (!studentExist) {
        return res.status(401).json({ error: 'Student does not exist.' });
      }
    }

    if (plan_id) {
      const planExist = await Plan.findByPk(plan_id);

      if (!planExist) {
        return res.status(401).json({ error: 'Plan does not exist.' });
      }
    }

    const { start_date } = req.body;

    await registration.update({
      student_id,
      plan_id,
      start_date,
    });

    return res.json(registration);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      order: ['price'],
      attributes: [
        'id',
        'start_date',
        'end_date',
        'plan_id',
        'student_id',
        'price',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'price', 'duration', 'title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json(registrations);
  }

  async delete(req, res) {
    const registration_id = req.params.registrationId;

    const registrationExist = await Registration.findByPk(registration_id);

    if (!registrationExist) {
      return res.status(401).json({ error: 'Registration does not exist.' });
    }

    await registrationExist.destroy();

    return res.json({ message: 'Registration deleted' });
  }
}

export default new RegistrationController();
