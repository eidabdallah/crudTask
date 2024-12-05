const name = document.querySelector('#productName');
const category = document.querySelector('#productCategory');
const price = document.querySelector('#productPrice');
const description = document.querySelector('#productDescription');
const addBtn = document.querySelector('#click');
const invalidName = document.querySelector('.invalid-name');
const invalidCategory = document.querySelector('.invalid-category');
const invalidPrice = document.querySelector('.invalid-price');
const invalidDescription = document.querySelector('.invalid-description');
const deleteAllBtn = document.querySelector('#deleteBtn');
const updateBtn = document.querySelector('#update');
const search = document.querySelector('#search');


let products = [];

if (localStorage.getItem("products") != null) {
    products = JSON.parse(localStorage.getItem("products"));
    displayCourses();
}

addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let isValid = validationInput();
    if (isValid) {
        const newProduct = {
            name: name.value,
            category: category.value,
            price: price.value,
            description: description.value,
        };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        SweetAlertMessageFromAdd();
        displayCourses();
        clearForm();
    }
});

function displayCourses() {
    const result = products.map((product, index) => {
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td><button onclick="editCourse(${index})" class="btn btn-outline-success">Update</button></td>
            <td><button onclick="deleteCourse(${index})" class="btn btn-outline-danger">Delete</button></td>
        </tr> `;
    }).join(' ');
    document.querySelector('#data').innerHTML = result;
}

function validationInput() {
    const isNameValid = validateField(name, /^[A-Z][a-z]{2,10}$/, "Name must start with a capital letter and contain at least 3 and at most 10 lowercase letters.", invalidName);
    const isCategoryValid = validateField(category, /^[A-Z][a-z]{2,10}$/, "Category must start with a capital letter and contain at least 2 and at most 10 lowercase letters.", invalidCategory);
    const isPriceValid = validateField(price, /^\d+(\.\d{1,3})?$/, "Price must be a number with up to 3 decimal places.", invalidPrice);
    const isDescriptionValid = validateField(description, /^[A-Za-z0-9.,!? ]{10,}$/, "Description must contain at least 10 characters and only letters, numbers, spaces, commas, periods, exclamation marks, and question marks.", invalidDescription);
    return isNameValid && isCategoryValid && isPriceValid && isDescriptionValid;
}

function validateField(field, pattern, errorMessage, errorElement) {
    if (!pattern.test(field.value)) {
        errorElement.innerHTML = errorMessage;
        field.classList.add("is-invalid");
        field.classList.remove("is-valid");
        return false;
    } else {
        errorElement.innerHTML = "";
        field.classList.remove("is-invalid");
        field.classList.add("is-valid");
        return true;
    }
}

name.addEventListener('input', () => {
    validateField(name, /^[A-Z][a-z]{2,10}$/, "Name must start with a capital letter and contain at least 3 and at most 10 lowercase letters.", invalidName);
});

category.addEventListener('input', () => {
    validateField(category, /^[A-Z][a-z]{2,10}$/, "Category must start with a capital letter and contain at least 2 and at most 10 lowercase letters.", invalidCategory);
});

price.addEventListener('input', () => {
    validateField(price, /^\d+(\.\d{1,3})?$/, "Price must be a number with up to 3 decimal places.", invalidPrice);
});

description.addEventListener('input', () => {
    validateField(description, /^[A-Za-z0-9.,!? ]{10,}$/, "Description must contain at least 10 characters and only letters, numbers, spaces, commas, periods, exclamation marks, and question marks.", invalidDescription);
});

function SweetAlertMessageFromAdd() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "new product added successfully"
    });
}

function clearForm() {
    name.value = "";
    category.value = "";
    price.value = "";
    description.value = "";
    name.classList.remove("is-valid");
    category.classList.remove("is-valid");
    price.classList.remove("is-valid");
    description.classList.remove("is-valid");
}

deleteAllBtn.addEventListener('click', () => {
    Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the selected item. This cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            products = [];
            localStorage.setItem("products", JSON.stringify(products));
            displayCourses();
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "The item has been deleted successfully.",
                confirmButtonText: "OK"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                icon: "info",
                title: "Cancelled",
                text: "Your item is safe.",
                confirmButtonText: "OK"
            });
        }
    });
});

function deleteCourse(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the selected item. This cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            products.splice(index, 1);
            localStorage.setItem("products", JSON.stringify(products));
            displayCourses();
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "The item has been deleted successfully.",
                confirmButtonText: "OK"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                icon: "info",
                title: "Cancelled",
                text: "Your item is safe.",
                confirmButtonText: "OK"
            });
        }
    });
}

function editCourse(index) {
    const product = products[index];
    name.value = product.name;
    category.value = product.category;
    price.value = product.price;
    description.value = product.description;
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
    updateBtn.addEventListener('click', function updateHandler(e) {
        e.preventDefault();
        let isValid = validationInput();
        if (isValid) {
            product.name = name.value;
            product.category = category.value;
            product.price = price.value;
            product.description = description.value;
            localStorage.setItem("products", JSON.stringify(products));
            SweetAlertMessageFromEdit();
            displayCourses();
            clearForm();
            updateBtn.classList.add('d-none');
            addBtn.classList.remove('d-none');
            updateBtn.removeEventListener('click', updateHandler);
        }
    });
}

function SweetAlertMessageFromEdit() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: "Product updated successfully"
    });
}


search.addEventListener('input', (e)=>{
    const keyWord = search.value;
    const filteredCourses = products.filter((product)=>{
        return product.name.toLowerCase().includes(keyWord.toLowerCase());
    });
    const result = filteredCourses.map((product, index) => {
        return `
        <tr>
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td><button onclick="editCourse(${index})" class="btn btn-outline-success">Update</button></td>
            <td><button onclick="deleteCourse(${index})" class="btn btn-outline-danger">Delete</button></td>
        </tr> `;
    }).join(' ');
    document.querySelector('#data').innerHTML = result;
});