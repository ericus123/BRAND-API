import app from "./app";
//Listen for requests
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
