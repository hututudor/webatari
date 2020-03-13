import faker from 'faker';
import uuid from 'uuid/v4';
import { getProjects } from './projects';

export const getUser = () => ({
  id: uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  projects: getProjects(10)
});

export const getUserAsync = async userId => {
  await new Promise(r => setTimeout(r, 1000));
  return getUser();
};

export const getUsers = count => {
  let users = [];
  for (let i = 0; i < count; i++) {
    users[i] = getUser();
  }

  return users;
};

export const getUsersAsync = async count => {
  await new Promise(r => setTimeout(r, 1000));
  return getUsers(count);
};
