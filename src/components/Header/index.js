import React, { useState, useEffect, useRef } from "react";
import style from "./index.module.scss";
import logo from "../../assets/logo.png";
import camera from "../../assets/camera.png";
import xx from "../../assets/xx.png";
import mic from "../../assets/mic.png";
import axios from "axios";

const Header = () => {
  const [inputValue, setInputValue] = useState("");

  const [arr, setArr] = useState([]);

  const list = useRef([]);

  useEffect(() => {

    //防抖，限制频繁请求
    const timer = setTimeout(() => {
      axios
        .get("./keywords.json")
        .then((res) => {
          //过滤掉不符合条件的对象
          list.current = res.data.filter((obj) => {
            if (!inputValue) {
              return false;
            }
            //前缀匹配
            const regex = new RegExp(`^${inputValue}`);
            return regex.test(obj.text);
          });
          //如果长度等于1说明就是选中的那个，不需要重复更新
          if(list.current.length !== 1){
            setArr(list.current)
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFocus = () => {
    setArr(list.current)
  };

  const handleBlur = () => {
    setArr([])
  };

  const clickitem = (text) => {
    setInputValue(text);
  };

  const clear = () => {
    setInputValue("");
  }

  const items = arr.map((obj) => (
    <li
      key={obj.id}
      onMouseDown={() => {
        clickitem(obj.text);
      }}
    >
      {obj.text}
    </li>
  ));

  return (
    <div className={style.box}>
      <div className={style.logo}>
        <img src={logo} alt="百度logo" />
      </div>
      <div className={style.search}>
        <span>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <img src={camera} alt="camera" className={style.camera}/>
          <img className={style.mic} src={mic} alt="mic"/>
          { inputValue ? <img className={style.xx} src={xx} onMouseDown={clear} alt="xx"/> : <></>}
          <input type="submit" value="百度一下" readOnly />
        </span>
        <div className={ arr.length ? style.list : "" }>
          <div></div>
          <ul>{items}</ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
