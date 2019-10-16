import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, registration, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo ao Gym Point',
      template: 'registration',
      context: {
        student: student.name,
        start_date: format(parseISO(registration.start_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        end_date: format(parseISO(registration.end_date), 'dd/MM/yyyy', {
          locale: pt,
        }),
        price: (plan.price / 100).toFixed(2),
        total_price: (registration.price / 100).toFixed(2),
      },
    });
  }
}

export default new RegistrationMail();
