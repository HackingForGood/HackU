var iconBase = '/images/';
var icons = {
  0: {
    name: 'Trash',
    icon: iconBase + 'trash.png'
  },
  1: {
    name: 'Compost',
    icon: iconBase + 'Compost.png'
  },
  2: {
    name: 'Recycle',
    icon: iconBase + 'Recycle.png'
  }
};

function FriendlyChat() {
  this.checkSetup();
    // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');


  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
FriendlyChat.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in Friendly Chat.
FriendlyChat.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
FriendlyChat.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
FriendlyChat.prototype.onAuthStateChanged = function(user) {
  console.log(user);
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL; // Only change these two lines!
    var userName = user.displayName;   // Only change these two lines!
    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chant messages.
    this.loadTrashBins();

    // We save the Firebase Messaging Device token and enable notifications.
    // this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
FriendlyChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
FriendlyChat.prototype.checkSignedInWithMessage = function() {
  /* TODO(DEVELOPER): Check if user is signed-in Firebase. */
  if (this.auth.currentUser) {
    return true;
  }
  return false;
}

FriendlyChat.prototype.loadTrashBins = function() {
  map = window.map;	
  // Reference to the /messages/ database path.
  this.trashCansRef = this.database.ref('trash_cans');
  // Make sure we remove all previous listeners.
  this.trashCansRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setTrashCan = function(data) {
    var val = data.val();
    console.log(val.lat);
    console.log(val.lng);
    console.log(val.types);
          
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(val.lat, val.lng),
            icon: icons[0].icon,
            map: map
          });

    // this.displayTrashCan(val.lat, val.lng, val.type);
  }.bind(this);
  this.trashCansRef.on('child_added', setTrashCan);
  this.trashCansRef.on('child_changed', setTrashCan);
};

window.onload = function() {
  window.friendlyChat = new FriendlyChat();
};


// Saves a new message on the Firebase DB.
FriendlyChat.prototype.saveTrash = function(lat, lng, types) {
  // Check that the user entered a message and is signed in.
  if (lat && lng && types) {
    var currentUser = this.auth.currentUser;
    // Add a new message entry to the Firebase Database.
    this.trashCansRef.push({
      lat: lat,
      lng: lng,
      types: types,
      name: currentUser.displayName,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function() {
      // Clear message text field and SEND button state.
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};