import '../assets/css/CustomOption.css';

const CustomOption = ({ setSelected, data, selected }) => {
    return (
        <div className='container-custom-option'>
            {data.map((item, index) =>
                <div key={index} className='custom-option-item' onClick={() => setSelected(item)}>
                    <span className={`${(selected && selected?.id === item.id) ? 'active' : ''}`}>{item.name}</span>
                </div>
            )}
        </div>
    );
}
export default CustomOption;