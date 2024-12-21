import { useState } from 'react';
import '../assets/css/OptionWG.css';

const OptionWG = ({ optionWGRef, openWG, showConfirm, workGroup, deleteWG }) => {

    const options = [
        { name: 'Edit work group', onClick: () => openWG(true) },
        { name: 'Delete work group', color: 'Red', onClick: () => handleDelete() }
    ];

    const handleDelete = () => {
        if (workGroup?.listTask > 0) {
            showConfirm(true);
        }else{
            deleteWG();
        }
    }


    return (
        <div className='container-option-work-group' ref={optionWGRef}>
            {options.map((item, index) => <div key={index} className='option-work-group-item' onClick={item.onClick}>
                <span className={`${item.color && 'delete'}`}>{item.name}</span>
            </div>)}
        </div>
    );
}
export default OptionWG;