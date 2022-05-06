export const singleFileUpload = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    res.status(201).send('File uploaded successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
