import '../assets/css/Option.css';

const Option = ({ list, selectedItem, setSelectedItem }) => {
    return (
        <div className="option-container">
            {list.map((item) =>
                <div className="option-item">
                    <div className='option-selected'>
                        {selectedItem === item.name && (<i className="fas fa-check"></i>)}
                    </div>
                    <span className='option-item-name'>{item.name}</span>
                </div>
            )}
        </div>
    );
};
export default Option;
