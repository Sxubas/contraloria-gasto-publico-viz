<template>
  <div id="app">
    <div class="header">
      <div class="header-left-container">
        <img alt="logo contraloría" src="./assets/logo1.png">
        <div class="header-text-container">
          <small>Visualización interactiva</small>
          <h1>Asignación del ingreso y gasto público</h1>
        </div>
      </div>
      <div class="header-right-container">
        <router-link to="/demo">Más información</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  border-bottom: 1px solid gray;
}

.header-left-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.header-right-container {
  align-self: flex-end;
}

.header img {
  width: 80px;
  margin: 4px;
}

.vertical-hr {
  width: 1px;
  height: 80px;
  margin: 0 8px;
  background-color: grey;
}

.header-text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 16px;
}

.header h1 {
  font-size: 2.3rem;
  margin: 0;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
