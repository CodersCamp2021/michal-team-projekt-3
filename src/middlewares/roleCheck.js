export const roleCheck = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(401).json({ message: 'Access denied.', errors: [] });

  return next();
};
