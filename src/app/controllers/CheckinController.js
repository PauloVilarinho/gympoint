import { Op } from 'sequelize';
import { isAfter, subDays, startOfDay } from 'date-fns';

import Checkin from '../models/Checkin';
import Registration from '../models/Registration';

class CheckinController {
  async store(req, res) {
    const student_id = req.params.studentId;

    const registrationValid = await Registration.findOne({
      where: {
        start_date: {
          [Op.lte]: new Date(),
        },
        end_date: {
          [Op.gte]: new Date(),
        },
        student_id,
      },
    });

    if (!registrationValid) {
      return res.status(401).json({ error: 'Matricula pendente' });
    }

    const lastCheckins = await Checkin.findAll({
      where: {
        student_id,
      },
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    if (lastCheckins.length >= 5) {
      const { created_at } = lastCheckins[lastCheckins.length - 1];
      const compare_date = startOfDay(created_at);
      const seven_days_ago = subDays(startOfDay(new Date()), 7);
      if (isAfter(compare_date, seven_days_ago)) {
        return res.status(401).json({
          error: 'You can only make 5 checkins in a 7 days timespan',
        });
      }
    }

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const student_id = req.params.studentId;

    const { page = 1 } = req.query;

    const checkins = await Checkin.findAll({
      where: { student_id },
      limit: 20,
      offset: (page - 1) * 20,
      order: [['created_at', 'DESC']],
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
