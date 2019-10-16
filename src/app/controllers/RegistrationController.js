import { parseISO, startOfDay, isBefore } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async store(req, res) {
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
}

export default new RegistrationController();
