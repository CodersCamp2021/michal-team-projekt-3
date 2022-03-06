export const roleCheck = (req, res, next, roles) => {
  if (!roles.includes(req.user.role))
    return res.status(401).send('Access denied.');

  return next();
};
