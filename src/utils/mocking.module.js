import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const generatePets = (quantity) => {
  const species = ['perro', 'gato', 'pájaro', 'pez', 'conejo', 'tortuga', 'hamster'];
  return Array.from({ length: quantity }, () => ({
    name: faker.person.firstName(),
    specie: faker.helpers.arrayElement(species),
    birthDate: faker.date.past(10),
    adopted: faker.datatype.boolean(),
    image: faker.image.urlLoremFlickr({ category: 'animals' })
  }));
};

export const generateUsers = async (quantity) => {
  const hashedPassword = await bcrypt.hash('coder123', 10);
  return Array.from({ length: quantity }, () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: []
  }));
};