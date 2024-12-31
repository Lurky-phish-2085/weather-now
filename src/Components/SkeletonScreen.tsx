function SkeletonScreen() {
  return (
    <>
      <div className="grid">
        <div className="s6">
          <article>
            <progress className="max" />
            <h4>
              <span>&nbsp;</span>
            </h4>
          </article>
        </div>
        <div className="s4"></div>
        <div className="s2 right-align">
          <article>
            <progress className="max" />
            <h4>
              <span>&nbsp;</span>
            </h4>
          </article>
        </div>
      </div>
      <div className="grid">
        <div className="s3">
          <article className="max">
            <progress className="max" />
            <h1>
              <span>&nbsp;</span>
            </h1>
            <h1>
              <span>&nbsp;</span>
            </h1>
          </article>
        </div>
        <div className="s8"></div>
        <div className="s1 right-align">
          <article>
            <progress className="max" />
            <h4>
              <span>&nbsp;</span>
            </h4>
          </article>
          <article className="max">
            <progress className="max" />
            <span>&nbsp;</span>
          </article>
        </div>
      </div>
    </>
  );
}

export default SkeletonScreen;
