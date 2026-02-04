import { useState } from "react";
import { TimelineCommit } from "./useCollabLensData";

interface Props {
  username: string;
  timeline: TimelineCommit[];
}

export const CommitDropdown = ({ username, timeline }: Props) => {
  const [open, setOpen] = useState(false);

  const commits = timeline
    .filter(c => c.username === username)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        Show More
      </button>

      {open && (
        <div>
          {commits.map(commit => (
            <div key={commit.commitUrl}>
              <p>{commit.message}</p>
              <small>{new Date(commit.date).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
