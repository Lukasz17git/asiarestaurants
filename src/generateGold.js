const gold = (sentence) => sentence.split(' ').flatMap((word, i, words) => i + 1 < words.length ? [word, ' '] : [word]).map((word, index) => <span key={index}>{word}</span>)

export default gold