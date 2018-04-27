class Tools {
  stringToInt (parma) {
    return isNaN(parma) ? parma : parma + 'px'
  }
  getTrueNum (father, percent) {
    if (typeof percent === 'number') {
      return percent > father ? father : percent
    } else {
      return father * this.percentToPoint(percent)
    }
  }
  percentToPoint (percent) {
    let point = percent.replace('%', '').replace(' ', '')
    point = point / 100
    return point
  }
}
export default Tools
