<template>
    <footer>
        <div id=center>
            <ul id=text>
                <li>
                    <a class="caps" href="https://lfazliev.com/ind/index.html">Home & about</a>
                </li>
                <li>
                    <a class="caps" href="https://lfazliev.com/contacts/index.html">Contacts</a>
                </li>
                <li>
                    <a class="caps" href="https://lfazliev.com/hom/index.html">My works</a>
                </li>
                <li>
                    <a class="caps" href="">Blog</a>
                </li>
            </ul>
            <ul id=social>
                <li>
                    <a class="fb" href="https://www.facebook.com/lfazliev/"></a>
                </li>
                <li>
                    <a class="yt" href="https://www.youtube.com/c/WarLenar"></a>
                </li>
                <li>
                    <a class="vk" href="https://vk.ru/lfazliev"></a>
                </li>
            </ul>
        </div>
        <hr>
        <p style="color: white">Fazliev Lenar 2023</p>
    </footer>
</template>
<style  lang = 'scss'>
footer {
    background-color: rgb(126, 110, 68);
    width: 90%;
    min-height: 20vh;
    padding: 3vw 5%;

    >p {
        text-align: center;
        font-size: 14px;
        color: white;
        margin-top: 15px;
    }

    #center {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-around;

        #text {
            a.caps {
                color: rgb(255, 255, 255);
                text-decoration: none;
                font-size: 20px;
            }

            a.caps::after {
                content: '';
                width: 0px;
                height: 1px;
                display: block;
                background: black;
                transition: 400ms;
            }

            a.caps:hover::after {
                width: 100%;
            }
        }

        #social {
            li {
                display: inline-block;
            }

            li a {
                background-repeat: no-repeat;
                width: 60px;
                height: 60px;
                display: block;
            }

            a.fb {
                background: url('@/assets/imgfoot/fb_gray.png') center/cover no-repeat;
                transition: 300ms;
            }

            a.fb:hover {
                background: url('@/assets/imgfoot/fb.png') center/cover no-repeat;
                transition: 300ms;
            }

            a.yt {
                background: url('@/assets/imgfoot/youtube_gray.png') center/cover no-repeat;
                transition: 300ms;
            }

            a.yt:hover {
                background: url('@/assets/imgfoot/youtube.png') center/cover no-repeat;
                transition: 300ms;
            }

            a.vk {
                background: url('@/assets/imgfoot/vkgray.svg') center/cover no-repeat;
                transition: 300ms;
            }

            a.vk:hover {
                background: url('@/assets/imgfoot/vk.svg') center/cover no-repeat;
                transition: 300ms;
            }
        }


        ul {
            margin: 0;
            padding: 0;
            list-style-type: none;
            width: 40%;
            display: flex;
            justify-content: space-evenly;
            flex-wrap: wrap;

            @media screen and (max-width:1400px) {
                width: 50% !important;
            }

            >li {
                margin: auto 0;
                padding: 20px;

                @media screen and (max-width:900px) {
                    margin: 5px 10px;
                }
            }

        }
    }






}
</style>