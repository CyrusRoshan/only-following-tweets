import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { getStyleChanges, setStyleChanges, StyleChanges } from './stylechanges';

const PopupPage = () => {
  const [styleChanges, updateStyleChanges] = useState<StyleChanges>({});
  useEffect(() => {
    getStyleChanges().then((changes) => updateStyleChanges(changes));
  }, []);

  const syncStyleChanges = (changes?: StyleChanges) => {
    if (changes) {
      updateStyleChanges(changes);
      setStyleChanges(changes);
      return;
    }
    setStyleChanges(styleChanges);
  };

  const updateKey = (oldKey: string, newKey: string) => {
    const newChanges = { ...styleChanges };

    const value = newChanges[oldKey];
    delete newChanges[oldKey];
    newChanges[newKey] = value;

    updateStyleChanges(newChanges);
  };
  const updateValue = (key: string, value: string) => {
    const newChanges = { ...styleChanges, [key]: value };
    updateStyleChanges(newChanges);
  };

  const addNewStyleChange = () => {
    // hacky way to add a new row
    const newChanges = { ...styleChanges, key: 'value' };
    syncStyleChanges(newChanges);
  };

  const deleteStyleChange = (key: string) => {
    const newChanges = { ...styleChanges };
    delete newChanges[key];
    syncStyleChanges(newChanges);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <fieldset>
        <legend>Hide tweets using:</legend>

        {Object.keys(styleChanges).map((key, i) => {
          const value = styleChanges[key];

          return (
            <React.Fragment key={i}>
              <p style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  value={key}
                  onChange={(e) => updateKey(key, e.currentTarget.value)}
                  onBlur={() => syncStyleChanges()}
                />
                <span>:</span>
                <input
                  value={value}
                  onChange={(e) => updateValue(key, e.currentTarget.value)}
                  onBlur={() => syncStyleChanges()}
                />

                <button onClick={() => deleteStyleChange(key)}>[-]</button>
              </p>
            </React.Fragment>
          );
        })}

        <button onClick={() => addNewStyleChange()}>[+]</button>
      </fieldset>
    </div>
  );
};

ReactDOM.render(<PopupPage />, document.querySelector('#root'));
