import fetch from 'isomorphic-fetch';
const dateregex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateregex.test(value)) { return new Date(value); }
  return value;
}

export default async function graphQLFetch(query, variables = {}, showError = null) {
  const apiEndpoint =(__isBrowser__) ? window.ENV.UI_API_ENDPOINT : process.env.UI_SERVER_API_ENDPOINT;
  console.log(process.env.UI_SERVER_API_ENDPOINT);
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code === 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        if (showError) {
          showError(`${error.message}:\n${details}`);
        } else {
          alert(`${error.message}:\n${details}`);
        }
      } else if (showError) {
        showError(`${error.extensions.code}: ${error.message}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    if (showError) {
      showError(`Error in sending data to server: ${e.message}`);
    }
    return e;
  }
}
