const fortunes = [
    "one",
    "two",
    "three",
]

exports.getFortune = () => {
    const index = Math.floor(Math.random()*fortunes.length)
    return fortunes[index]
}