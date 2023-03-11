<template>
    <div>
        <div id="head"><a href="https://lfazliev.com"></a></div>
        <hr>
    </div>
</template>
<style  lang = 'scss'>
#head {
    @media screen and (max-width:900px) {
        height: 200px;
    }

    transition: 300ms;
    background: url('@/public/img/channels4_banner.jpg') 54% center/cover no-repeat;
    height: 300px;

    >a {
        display: block;
        width: 100%;
        height: 100%
    }
}
</style>