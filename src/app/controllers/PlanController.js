import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .required(),
      price: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error' });
    }

    const { title, duration, price } = req.body;

    const plan = await Plan.create({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      order: ['price'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 5,
      offset: (page - 1) * 5,
    });

    return res.json(plans);
  }

  async delete(req, res) {
    const plan_id = req.params.planId;

    const planExist = await Plan.findByPk(plan_id);

    if (!planExist) {
      return res.status(401).json({ error: 'Plan does not exist' });
    }

    await planExist.destroy();

    return res.json({ message: 'plan deleted' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(401).json({ error: 'Validation Error.' });
    }

    const plan_id = req.params.planId;

    const plan = await Plan.findByPk(plan_id);

    await plan.update(req.body);

    return res.json(plan);
  }
}

export default new PlanController();
