import React from 'react'
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Box
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete'
import {nanoid} from "nanoid"

export const FormDialog = (props: any) => {
  type Form = {
    "id": string,
    "title": string,
    "url": string,
    "description": string,
    "tags": string[]
  }

  const initiateNewForm = (): Form => ({
    "id": nanoid(), 
    "title": "",
    "url": "",
    "description": "",
    "tags": []
  })
  
  const resetFormValidation = () => ({titleError: false, descriptionError: false});

  const [newTagInput, setNewTagInput] = React.useState("");
  const [formInput, setFormInput] = React.useState(() => initiateNewForm());
  const [formValidation, setFormValidation] = React.useState(() => resetFormValidation());
  const [deleteValidator, setDeleteValidator] = React.useState(false);
  const {titleError, descriptionError} = formValidation;
  const currentCard = props.currentCard();

  //Used to populate the edit form with the proper info
  React.useEffect(() => {
    if (currentCard && props.editMode) {
      setFormInput({
        id: currentCard.bulletin_id,
        title: currentCard.bulletin_title,
        url: currentCard.bulletin_url,
        description: currentCard.bulletin_description,
        tags: currentCard.bulletin_tags
      } as Form);
    }
  }, [props.editMode]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {name, value} = event.target;
    if (name === "tags") {
        setNewTagInput(value);
    } else {
        setFormInput(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }
  }
  
  const resetTagInput = () => {
      setNewTagInput("");
  }

  const checkDuplicatedTags = (tagArr: string[], tag: string): boolean => {
    return tagArr.includes(tag.toLowerCase())
    }

  const addNewTag = (event: React.KeyboardEvent & React.ChangeEvent<HTMLInputElement>): void => {
    const {name, value} = event.target;
    if (event.key === "Enter" && value !== "") {
      if (checkDuplicatedTags(formInput.tags, value)) {
          resetTagInput();
      } else {
          setFormInput((prevFormData: Form) => ({
              ...prevFormData,
              [name]: [...prevFormData.tags, value.toLowerCase()]
          }));
          resetTagInput();
      }
    }
  }

  const deleteTag =  (tagToDelete: string) => {
    setFormInput(prevFormData => ({
      ...prevFormData,
      ["tags"]: prevFormData.tags.filter(tag => tagToDelete != tag)
    }));
  }

  const eraseForm = () => {
    resetTagInput();
    setTimeout(() => props.setEditMode(false), 1);
    setFormInput(initiateNewForm());
    setFormValidation(resetFormValidation());
    setDeleteValidator(false);
    props.closeDialog();
  }

  const createNewCard = (newCard: Form) => {
    if (formInput.title === "") {
      setFormValidation(prevError => ({
        ...prevError,
        titleError: true
      }));
    } else if (formInput.description === "") {
        setFormValidation(prevError => ({
          ...prevError,
          descriptionError: true
        }));
    } else {
        props.editMode ? props.confirmEdit(newCard.id, newCard) :props.addNewCard(newCard);
        eraseForm();
    }
  }

  const handleDeleteCard = () => {
    props.deleteCard(formInput.id);
    eraseForm();
  }

  const deleteButton = () => {
    if (!deleteValidator) {
      return (
        <IconButton onClick={() => setDeleteValidator(true)}>
          <DeleteIcon />
        </IconButton>
      )
    } else {
        return(
          <Button 
            onClick={handleDeleteCard}
            color="secondary" 
            variant="contained"
          >
            Confirm Delete
          </Button>
        )
      }
  }

  const formTitle = () => (
    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <DialogTitle>{props.editMode ? "Edit Bulletin" : "Add New Bulletin"}</DialogTitle>
      <IconButton onClick={eraseForm}>
        <CloseIcon />
      </IconButton>
    </Box>
  )
  
  return (
  <Dialog open={props.status}>
      {formTitle()}
      <DialogContent>
        <TextField
          margin="normal"
          label="Title"
          id="title"
          name="title"
          fullWidth
          variant="outlined"
          value={formInput.title}
          onChange={handleChange}
          required
          error={titleError}
          inputProps={{ maxLength: 75 }}
          helperText={`${formInput.title.length}/75`}
        />
        <TextField
          margin="normal"
          label="Description"
          id="description"
          name="description"
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          value={formInput.description}
          onChange={handleChange}
          required
          error={descriptionError}
          inputProps={{ maxLength: 300 }}
          helperText={`${formInput.description.length}/300`}
        />
        <TextField
          margin="normal"
          label="URL"
          id="url"
          name="url"
          fullWidth
          variant="outlined"
          value={formInput.url}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          label="Category"
          id="tags"
          name="tags"
          fullWidth
          variant="outlined"
          placeholder="Press enter to add a new tag"
          helperText="Press enter to add a new tag"
          value={newTagInput}
          onChange={handleChange}
          onKeyUp={addNewTag}
        />
        {props.tags(formInput.tags, true, deleteTag)}
      </DialogContent>
      <DialogActions>
        {props.editMode && deleteButton()}
        <Button 
          onClick={() => createNewCard(formInput)}
          color="primary" 
          variant="contained"
        >Save</Button>
      </DialogActions>
    </Dialog>
  );
}