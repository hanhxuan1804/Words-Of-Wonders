/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Divider,
  IconButton,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDictionary } from "../hooks/useDictionary";
import { Add } from "@mui/icons-material";

const Home = () => {
  const [words, setWords] = useState([]);
  const [numChar, setNumChar] = useState(3);
  const { checkWord, getWord, getAllWord } = useDictionary();
  const [wordlist, setWordlist] = useState([]);
  const [openExample, setOpenExample] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (words.length === 0) {
      alert("Please input words");
      return;
    }
    if (words.length < numChar) {
      alert("Please input >= " + numChar + " words");
      return;
    }

    setLoading(true); // Set loading to true before starting the async operations

    const uncheckedWords = [];
    await new Promise((resolve) => {
      GenerateWord(words, "", numChar, uncheckedWords, resolve);
    });

    const checkWords = uncheckedWords.filter((word) => checkWord(word));
    const uniqueCheckWords = Array.from(new Set(checkWords));

    // Introduce a delay of 0 milliseconds using setTimeout
    setTimeout(async () => {
      const nwordlist = [];
      for (const word of uniqueCheckWords) {
        const [wordData] = await getWord(word);
        nwordlist.push(wordData);
      }

      setLoading(false); // Set loading to false after all async operations are completed
      setWordlist(nwordlist);
    }, 0);
  };

  const GenerateWord = (
    availableChars,
    currentWord,
    remainingChars,
    uncheckedWords,
    callback
  ) => {
    if (remainingChars === 0) {
      uncheckedWords.push(currentWord);
      callback();
      return;
    }
    for (let i = 0; i < availableChars.length; i++) {
      const char = availableChars[i];
      const newWord = currentWord + char;
      const newAvailableChars = availableChars.filter(
        (_, index) => index !== i
      );
      GenerateWord(
        newAvailableChars,
        newWord,
        remainingChars - 1,
        uncheckedWords,
        callback
      );
    }
  };

  return (
    <div>
      <Card sx={{ width: 900, minHeight: 600 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            id="outlined-basic"
            label="Words"
            variant="outlined"
            sx={{ width: 300, margin: 2 }}
            onChange={(e) => {
              const tmp = e.target.value.split(" ");
              const wordlist = tmp.reduce((acc, cur) => {
                if (cur !== "") {
                  acc.push(cur);
                }
                return acc;
              }, []);
              setWords(wordlist);
            }}
          />
          <Select
            native
            defaultValue={3}
            sx={{ width: 100, margin: 2 }}
            onChange={(e) => {
              const number = parseInt(e.target.value);
              setNumChar(number);
            }}
          >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </Select>
          <Button
            variant="contained"
            sx={{ width: 100, margin: 2 }}
            onClick={async () => {
              setWordlist([]);
              setOpenExample([]);
              setLoading(true); // Set loading to true before calling handleGenerate
              await handleGenerate();
            }}
          >
            Generate
          </Button>
        </div>
        <Divider />
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell>IPA</TableCell>
              <TableCell>Definition</TableCell>
              <TableCell>Example</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wordlist.map((row, rowindex) => (
              <TableRow
                key={rowindex}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.word}
                </TableCell>
                <TableCell>{row.ipa}</TableCell>
                <TableCell>
                  {row.types?.map((type, index) => (
                    <div key={index}>
                      <div>- {type.name}</div>
                      <div>
                        {type.definition.map((definition, index) => (
                          <div key={index}>{definition}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {openExample.includes(rowindex) ? (
                    row.types.map((type, index) => (
                      <div key={index}>
                        <div>- {type.name}</div>
                        <div>
                          {type.example.map((example, index) => (
                            <div key={index}>{example}</div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <IconButton
                      onClick={() => {
                        const tmp = [...openExample];
                        tmp.push(rowindex);
                        setOpenExample(tmp);
                      }}
                      sx={{ padding: 0 }}
                    >
                      <Add />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 500,
            }}
          >
            loading...
          </div>
        )}
      </Card>
    </div>
  );
};

export default Home;
