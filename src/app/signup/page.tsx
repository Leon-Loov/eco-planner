import Signup from "@/components/forms/userInfo/signup";
import AttributedImage from "@/components/generic/images/attributedImage";
import styles from "./page.module.css" with { type: "css" };;

export default async function Page() {
  return (
    <>
      <main className={`${styles.gridLayout} container margin-auto padding-y-500 grid gap-300 align-items-center`}>
        <Signup />
        <div className={`${styles.image} position-relative width-100 rounded overflow-hidden`}>
          <AttributedImage src="/images/hydroelectric.jpg" alt="">
            <div className="width-100 padding-100">
              Photo by <a className="color-purewhite" href="https://unsplash.com/@dmey503?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Dan Meyers</a> on <a className="color-purewhite" href="https://unsplash.com/photos/aerial-photography-of-body-of-water-w6X7XaolqA0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
            </div>
          </AttributedImage>
        </div>
      </main>
    </>
  )
}