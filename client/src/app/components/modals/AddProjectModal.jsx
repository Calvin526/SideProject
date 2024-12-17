import React, { useState } from "react";
import "../../globals.css";
import { useMutation, useQuery } from "@apollo/client";
import ReactModal from "react-modal";
import queries from "../../queries";
import { Button } from "@mui/material";

ReactModal.setAppElement("#__next");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    border: "1px solid #28547a",
    borderRadius: "4px",
    overflow: "visible",
    color: "black",
  },
};

function AddProjectModal(props) {
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [showAddModal, setShowAddModal] = useState(props.isOpen);

  const [error, setError] = useState(false);
  const [addProject] = useMutation(queries.addProject, {
    refetchQueries: [
      {
        query: queries.getUserById,
        variables: { id: props.user._id },
      },
    ],
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({
        query: queries.projects,
      });
      cache.writeQuery({
        query: queries.projects,
        data: { projects: [...projects, addProject] },
      });
    },
  });

  const handleCloseModal = () => {
    setShowAddModal(false);
    props.handleClose();
  };

  const [technologies, setTechnologies] = useState([
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "C++",
    "Ruby",
    "PHP",
    "TypeScript",
    "Swift",
    "Kotlin",
    "Go",
    "Rust",
    "HTML",
    "CSS",
    "SQL",
    "GraphQL",
    "Node.js",
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Svelte",
    "Tailwind CSS",
    "Bootstrap",
    "AWS",
    "Google Cloud",
    "Oracle Cloud",
    "Docker",
    "Kubernetes",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Firebase",
    "Git",
    "GitHub",
    "Other",
  ]);
  const handleChangeTechnologies = (i, technology) => {
    const newTechnology = [...technologies];
    newTechnology[i] = technology;
    setTechnologies(newTechnology);
  };
  const addTechnology = () => {
    setTechnologies([...technologies, ""]);
  };
  const imageUpload = (e) => {
    const files = Object.values(e.target.files);
    console.log(files);
    let uploaded = [];
    let uploadedPreviews = [];
    if (files.length + images.length > 5) {
      setError("You can only upload 5 images!");
      e.target.value = "";
      return;
    }
    files.forEach((file) => {
      if (file.size > 10000000) {
        setError("Image size must be less than 10MB!");
        return;
      } else {
        uploaded.push(file);
        uploadedPreviews.push(URL.createObjectURL(file));
      }
    });
    setImages((prev) => [...prev, ...uploaded]);
    setImagePreview((prev) => [...prev, ...uploadedPreviews]);
    e.target.value = "";
    setError("");
  };
  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, index) => index !== i));
    setImagePreview((prev) => prev.filter((_, index) => index !== i));
  };
  const projectSubmit = async (e) => {
    e.preventDefault();

    let projectName = document.getElementById("name").value;
    let projectDescription = document.getElementById("description").value;

    // Taken from Online
    const formData = new FormData(e.target);
    const selectedTechnologies = formData.getAll("technologies");
    const files = images;

    if (projectName.trim().length < 2 || projectName.trim().length > 50) {
      setError("Project Name must be between 2 and 50 characters!");
      return;
    }

    projectName = projectName.trim();

    if (projectDescription.trim().length == 0) {
      setError("Project Description must not be empty!");
      return;
    }

    projectDescription = projectDescription.trim();

    if (selectedTechnologies.length <= 0) {
      setError("At least one technology must be checked!");
      return;
    }

    const readFileAsDataURL = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const getImagesData = async (files) => {
      const imagePromises = files.map((file) => readFileAsDataURL(file));
      return Promise.all(imagePromises);
    };
    let imagelist = [];
    if (files) {
      imagelist = await getImagesData(files);
    }
    try {
      await addProject({
        variables: {
          name: projectName,
          technologies: selectedTechnologies,
          description: projectDescription,
          creatorId: props.user._id,
          images: imagelist || [],
        },
      });

      //alert("Project successfully edited");
      setError("");
      props.handleClose();
    } catch (e) {
      setError(e.message);
      return;
    }
  };

  return (
    <div>
      <ReactModal
        name="editProjectModal"
        isOpen={props.isOpen}
        onRequestClose={props.handleClose}
        contentLabel="Add Project"
        style={customStyles}
      >
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">
            Add Project Form
          </h1>
          <h3 className="text-red-500 text-xl mb-4 text-center font-bold underline ">
            {error}
          </h3>
          <form onSubmit={projectSubmit} className="space-y-4">
            <label className="text-xl font- mb-1"> Project Name: </label>
            <input
              id="name"
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />
            <br /> <br />
            <label className="text-xl font- mb-1"> Technologies Used: </label>
            <div className="grid grid-cols-6 gap-1">
              {technologies.map((tech) => (
                <div key={tech} className="mb-2">
                  <input
                    type="checkbox"
                    id={tech.toLowerCase()}
                    name="technologies"
                    value={tech}
                    className="mr-2"
                  />
                  <label htmlFor={tech.toLowerCase()}>{tech}</label>
                </div>
              ))}
            </div>
            <br />
            <label className="text-xl font- mb-1"> Project Description: </label>
            <textarea
              id="description"
              className=" w-full rounded-md border-2 border-blue-500 rounded-full"
            />
            <label className="text-xl font- mb-1"> Project Images: </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={imageUpload}
              hidden
            />
            <label
              className="w-full border-5 border-blue-600 rounded-lg text-sm shadow-sm hover:shadow-lg focus:outline-none "
              htmlFor="images"
            >
              Select file
            </label>
            <div className="flex grid-cols-* space-x-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-md absolute top-0 right-0 bg-red-500 text-white p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onSubmit={projectSubmit}
              >
                Add Project
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
    </div>
  );
}
export default AddProjectModal;
