<template>
    <div class="card">
        <div class="card-logo">
            <slot name="logo"></slot> <!-- Assurez-vous que l'image est bien incluse ici -->
        </div>
        <slot name="header" class="card-header"></slot>
        <slot name="content" class="card-content"></slot>
    </div>
</template>

<style>
.card {
    position: relative;
    background: #000000;
    height: 100%;
    padding: 12px;
    border-radius: 8px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}

.card-logo {
    width: 60px;
    height: 60px;
    border-radius: 100000px;
    background: #282c34;
    padding: 4px;
    position: absolute;
    z-index: 10;
    transform: translateX(-50%);
    left: 50%;
    top: -25px;
}

.card-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}
</style>