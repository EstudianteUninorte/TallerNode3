const bmi = (weight, height) => {
    return height == 0 ? -1 : weight/(height*height) 
}
module.exports = bmi;