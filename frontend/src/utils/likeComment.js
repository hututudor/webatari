import axios from 'axios';
import config from '../config/config';

export const likeComment = (comments, setComments) => async (id, value) => {
  const index = comments.findIndex((comment) => comment.id === id);

  if (index === -1) return;

  const newComments = [...comments];
  newComments[index].liked = value;

  if (!value) {
    newComments[index].likes--;
  } else {
    newComments[index].likes++;
  }

  setComments(newComments);

  try {
    let url = '';
    if (value) {
      url = config.serverUrl + '/comments/like/' + id;
    } else {
      url = config.serverUrl + '/comments/dislike/' + id;
    }

    await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  } catch (e) {
    console.error(e);
  }
};
