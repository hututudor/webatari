import faker from 'faker';
import uuid from 'uuid/v4';

const getProject = () => ({
  id: uuid(),
  name: faker.name.title(),
  description: faker.lorem.sentence(),
  likes: faker.random.number(1000),
  liked: faker.random.boolean(),
  user: {
    id: uuid(),
    name: faker.name.findName()
  }
});

export const getProjects = count => {
  let projects = [];
  for (let i = 0; i < count; i++) {
    projects[i] = getProject();
  }

  return projects;
};

export const getProjectsAsync = async count => {
  await new Promise(r => setTimeout(r, 1000));
  return getProjects(count);
};
