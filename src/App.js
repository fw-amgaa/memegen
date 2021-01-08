import React, { useState, useEffect } from 'react';
import { Meme } from './components/Meme';
import './style.css';

const objectToQueryParam = (obj) => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return '?' + params.join('&');
};

function App() {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState('');
  const [loading, isLoading] = useState(false);

  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [meme, setMeme] = useState(null);

  useEffect(() => {
    isLoading(true);
    fetch('https://api.imgflip.com/get_memes')
      .then((res) => res.json())
      .then(
        (template) => {
          isLoading(false);
          setTemplates(template.data.memes);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          isLoading(false);
          setError(error);
        }
      );
  }, []);

  if (meme) {
    return (
      <div style={{ textAlign: 'cemter' }}>
        <img src={meme} alt="custom meme" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container">
        {template && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              // Add logic to create mem from api
              const params = {
                template_id: template.id,
                text0: topText,
                text1: bottomText,
                username: 'Amgalanbayar',
                password: '00231131',
              };
              const response = await fetch(
                `https://api.imgflip.com/caption_image${objectToQueryParam(
                  params
                )}`
              );
              const responseMeme = await response.json();
              console.log(responseMeme);
              setMeme(responseMeme.data.url);
            }}
          >
            <div className="full-template">
              <Meme template={template} />
            </div>
            <input
              placeholder="top text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
            <input
              placeholder="bottom text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
            <button type="submit">Create Meme</button>
          </form>
        )}

        {!template && (
          <>
            <div>
              <h1>Pick a Template</h1>
            </div>
            {templates.map((template) => {
              return (
                <div className="template">
                  <Meme
                    template={template}
                    onClick={() => {
                      setTemplate(template);
                    }}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }
}

export default App;
