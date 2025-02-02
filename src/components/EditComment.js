import { useEffect, useState } from 'react';
import '../assets/css/EditComment.css';
import ReactDOM from 'react-dom';
import { Mention, MentionsInput } from 'react-mentions';
import { edit } from '../services/commentService';
import Cookies from 'js-cookie';

const EditComment = ({ setClose, comment, members, renderSuggestion, idTask, idWG, idG, fetchData }) => {
    const [data, setData] = useState('');

    useEffect(() => {
        let formattedComment = comment.content;
        let x = 0;
        const sortedTags = [...comment.listTag].sort((a, b) => a.start - b.start);
        comment.listTag.forEach(item => {
            const adjustedStart = item.start + x;
            const adjustedEnd = item.end + x;

            const beforeMention = formattedComment.substring(0, adjustedStart);
            const mentionText = formattedComment.substring(adjustedStart, adjustedEnd);
            const afterMention = formattedComment.substring(adjustedEnd);

            const linkedMention = `@[${mentionText}](${item.user.id})`;
            formattedComment = beforeMention + linkedMention + afterMention;
            x += linkedMention.length - mentionText.length;
        });
        setData(formattedComment);
    }, [])

    const editComment = async (accessToken, content, listTag) => {
        if (accessToken) {
            try {
                const rs = await edit(idTask, idWG, idG, comment?.id, content, listTag, accessToken);
            } catch (error) {
                console.error("Failed to edit comment:", error);
            }
        }
    }

    const handleEditComment = () => {
        const mentions = [];
        const regex = /@\[(.+?)\]\((.+?)\)/g;
        let match;
        let x = 0;
        while ((match = regex.exec(data)) !== null) {
            let s = match.index - x;
            x += (5 + match[2].length);
            let e = regex.lastIndex - x
            mentions.push({
                user: { id: match[2] },
                start: s,
                end: e,
            });
        }

        const accessToken = Cookies.get('accessToken');
        editComment(accessToken, data.replace(/@\[(.+?)\]\((.+?)\)/g, "$1"), mentions)
            .then(() => {
                return fetchData();
            })
            .catch((error) => {
                console.error("Failed to edit comment:", error);
            });
        setClose();
    }

    return ReactDOM.createPortal(
        <div className={`edit-comment-overlay`}>
            <div className='container-edit-comment'>
                <div className='edit-comment-header'>
                    <span>Edit comment</span>
                    <button onClick={setClose}><i className='fas fa-times'></i></button>
                </div>
                <MentionsInput className='mention-input' spellCheck={false} value={data} onChange={(e) => setData(e.target.value)} placeholder='Enter your comment'>
                    <Mention
                        trigger="@" data={members} renderSuggestion={renderSuggestion} className='mention' />
                </MentionsInput>
                <div className={`btn-save ${data ? 'active' : ''}`}><div></div><button onClick={handleEditComment}>Save</button></div>
            </div>
        </div>,
        document.body
    );
}
export default EditComment;