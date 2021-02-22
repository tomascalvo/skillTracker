function getInputDoc(resourceType) {
    let inputDoc = {}
    if (resourceType === "skills") {
      inputDoc = {
        ...inputDoc,
        name: "",
        description: "",
        projects: [],
        certifications: [],
        answers: [],
        flashcards: [],
        prerequisites: []
      }
    } else {
      inputDoc = {
        ...inputDoc,
        skills: []
      }
    }
    if (["projects", "certifications"].includes(resourceType)) {
      inputDoc = {
        ...inputDoc,
        href: "",
        date: new Date(),
      }
    }
    if (resourceType === "certifications") {
      inputDoc = {
        ...inputDoc,
        institution: ""
      }
    }
    if (["answers", "flashcards"].includes(resourceType)) {
      inputDoc = {
        ...inputDoc,
        question: ""
      }
    }
    if (resourceType === "flashcards") {
      inputDoc = {
        ...inputDoc,
        answer: ""
      }
    }
    return inputDoc;
  }

  export default getInputDoc;