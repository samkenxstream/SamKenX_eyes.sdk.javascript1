exports.create = function ({allowedUrls = []}) {
  return (req, res, next) => {
    if (allowedUrls.includes(req.headers.referer)) {
      next()
    } else {
      res.status(404).send('Not found')
    }
  }
}
