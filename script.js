let addresses = []
let id = 0

$(function() {
    $('#show').hide()
    $('#autocomplete').hide()
})

showList = () => {
    $('#show').html('')
    for (const address of addresses) {
        $('#show').append(
            `<div class='list' id='${address.id}'><strong>${address.name}</strong>
          click to view contact details
      <div>
      <button class='btn btn-primary edit' id='${address.id}' >Edit</button>
      <button class='delete btn btn-danger' id='${address.id}'>Delete</button>
      </div>
      </div>`
        )
    }
    $('#form').hide()
    $('#show').show()
    $('#add').show()
}

hideList = () => {
    $('#form').show()
    $('#show').hide()
    $('#add').hide()
    $('#details').hide()
}

$('#submit').click(() => {
    var name = $('#name').val()
    var email = $('#email').val()
    var phone = $('#phone').val()
    var address = $('#address').val()
    let formId = $('#id').val()
    let addressId = id += 1
    let filesSelected = $("#image")[0].files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(filesSelected);

    fileReader.onloadend = () => {
        if (formId) {
            addresses = addresses.filter(address => address.id !== parseInt(formId))
            addressId = parseInt(formId)
        }

        addresses.push({ name, email, phone, address, id: addressId, image: fileReader.result })
        clearForm()
        showList()
    };
    $('#autocomplete').show()
})

clearForm = () => {
    var inputs = $('.input')
    for (const input of inputs) input.value = ''
}

$('#add').click(() => {
    hideList()
    $('#autocomplete').hide()
})

$('#close').click(() => {
    showList()
    $('#autocomplete').show()
})

showDetails = (obj) => {
    showList()

    if (obj === undefined) return null

    $(`#${obj.id}`).html('')
    $(`#${obj.id}`).append(
        `<div id=''>
    <img id='img${obj.id}' src='#' class='image'/>
    <p> <strong>Name: </strong>${obj.name}</p>
    <p> <strong>Email: </strong>${obj.email}</p>
    <p> <strong>Phone: </strong>${obj.phone} </p>
    <p> <strong>Address: </strong>${obj.address}</p>
    <div class='detailsButton'>
    <button class='btn btn-primary edit' id='${obj.id}'>Edit</button>
    <button class='delete btn btn-danger' id='${obj.id}'>Delete</button>
    <button id='back' class='btn btn-default'>Back</button>
    </div>
    </div>`
    )
    $(`#img${obj.id}`).attr('src', obj.image)
    $(`#${obj.id}`).show()
}

$('#show').on('click', $('.list'), (event) => {
    if (event.target.id && event.target.className === 'list') {
        var id = parseInt(event.target.id)
        let addrs = addresses.filter(address => address.id === id)

        showDetails(addrs[0])
        $('#show').show()
    }
})

$('#show').on('click', $('.edit'), (event) => {
    if (event.target.id && event.target.className.includes('edit')) {
        var id = parseInt(event.target.id)
        let addrs = addresses.filter(address => address.id === id)[0]

        hideList()

        let inputs = $('.input')
        for (let input of inputs) input.value = addrs[input.name]
    }
})

$('#show').on('click', $('.delete'), (event) => {
    if (event.target.id && event.target.className.includes('delete')) {
        var id = parseInt(event.target.id)
        if (confirm('Are you sure you want to delete this contact?')) {
            addresses = addresses.filter(address => address.id !== id)
            showList()
        }
    }
})

$('#show').on('click', $('#back'), (event) => {
    event.target.id === 'back' && showList()
})

renderShow = (addressesArray) => {
    $('#show').html('')

    for (const address of addressesArray) {
        return (
            $('#show').append(
                `<div class='list' id='${address.id}'><strong>${address.name}</strong>
    click to view contact details
        <div>
        <button class='btn btn-primary edit' id='${address.id}' >Edit</button>
        <button class='delete btn btn-danger' id='${address.id}'>Delete</button>
        </div>
        </div>`
            )
        )
    }
}

$('#autocomplete').on("change keyup paste", (event) => {
    let searchContent = event.target.value.toLowerCase()
    let searchAddresses = addresses.filter(address => {
        return (
            address.name.toLowerCase().includes(searchContent) ||
            address.phone.toLowerCase().includes(searchContent) ||
            address.email.toLowerCase().includes(searchContent) ||
            address.address.toLowerCase().includes(searchContent)
        )
    })
    renderShow(searchAddresses)
})