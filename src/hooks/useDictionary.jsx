import { createContext, useState, useContext, useEffect } from "react";

export const DictionaryContext = createContext();

// eslint-disable-next-line react/prop-types
export const DictionaryProvider = ({ children }) => {
  const [dictionary, setDictionary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      fetch("src/dictionary.txt")
        .then((response) => response.text())
        .then((data) => {
          const worddata = data.split("@");
          const wordlist = worddata.slice(1).map((data) => {
            if (data === "") return null;
            let word = {
              word: "",
              ipa: "",
              types: [],
            };
            const type = data.split("*");
            type.map((data, index) => {
              if (index === 0) {
                word.word = data.split(" /")[0];
                word.ipa = data.split(word.word)[1].trim();
              } else {
                let type = {
                    name: "",
                    definition: [],
                    example:[],
                }
                const tmp = data.split("\n");
                tmp.map((data, index) => {
                  if (index === 0) {
                    type.name = data.trim();
                  } else {
                    if (data.startsWith("-")) {
                      type.definition.push(data.substring(1).trim());
                    } else if (data.startsWith("=")) {
                      type.example.push(data.substring(1));
                    }
                  }
                });
                word.types.push(type)
              }
            });
            return word;
          });
          setDictionary(wordlist);
        });
      setLoading(false);

    } catch (err) {
      console.log(err);
      alert("Error");
    }
  }, []);
  const checkWord = (word) => {
    const wordlist = dictionary.map((data) => data.word);
    return wordlist.includes(word);
  };
  const getWord = (word) => {
    const wordlist = dictionary.filter((data) => data.word === word);
    return wordlist;
  };
  const getAllWord = () => {
    return dictionary;
  };
  return (
    <DictionaryContext.Provider
      value={{ dictionary, setDictionary, checkWord, getWord, getAllWord, loading }}
    >
      {children}
    </DictionaryContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};

export default DictionaryProvider;
