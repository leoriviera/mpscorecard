import { Inter } from "next/font/google";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

import { clsx } from "../utils";

const inter = Inter({ subsets: ["latin"] });

// TODO - create 404 page, make look more snazzy
export default function Home() {
  const { push } = useRouter();

  return (
    <main
      className={clsx(
        "flex-col min-h-screen min-w-full px-6 lg:px-16 content-center bg-gradient-to-br from-yellow-100 via-red-200 to-blue-300",
        inter.className
      )}>
      <div className='mx-auto'>
        <h1 className='max-w-2xl text-3xl sm:text-6xl font-extrabold mb-4 text-gray-800 uppercase'>
          How did your MP vote over the last Parliament?
        </h1>
        <h2 className='max-w-xl mb-8 text-xl sm:text-4xl text-gray-600 uppercase font-bold'>
          Enter your postcode to get their scorecard.
        </h2>
      </div>

      <div>
        <Formik
          initialValues={{
            postcode: "",
          }}
          validationSchema={yup.object().shape({
            postcode: yup
              .string()
              .trim()
              .required("Please enter a postcode.")
              .matches(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, {
                message: "That postcode doesn't look valid!",
              })
              .notOneOf(
                ["SANTA1", "SAN TA1"],
                "Ho ho ho! Santa doesn't have an MP! 🎅🏼"
              ),
          })}
          onSubmit={async (values, { setErrors }) => {
            const { postcode } = values;

            const find = `https://api.postcodes.io/postcodes/${encodeURIComponent(
              postcode
            )}`;

            const response = await fetch(find);

            try {
              const {
                result: { parliamentary_constituency },
              } = (await response.json()) as {
                result: {
                  parliamentary_constituency: string;
                };
              };

              await push(
                `/constituency/${kebabCase(parliamentary_constituency)}`
              );
            } catch {
              setErrors({
                postcode:
                  "We couldn't find that postcode. Please try another one!",
              });
            }
          }}>
          {({ touched, errors, submitCount }) => (
            <Form>
              <label
                htmlFor='postcode'
                className='text-md sm:text-2xl text-gray-700 uppercase font-light'>
                Your postcode
              </label>
              <div className='flex mt-2'>
                <Field
                  required
                  id='postcode'
                  name='postcode'
                  placeholder='SW1A 2AA'
                  className='px-2 md:px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                <button
                  type='submit'
                  className='text-sm md:text-base h-full px-3 md:px-4 py-3 bg-red-600 text-white font-bold rounded-r-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'>
                  Submit
                </button>
              </div>
              {touched.postcode && errors.postcode && submitCount >= 1 && (
                <p className='mt-2 text-sm text-red-600'>{errors.postcode}</p>
              )}
            </Form>
          )}
        </Formik>
        <p className='mt-2 font-extralight font-gray-200'>
          This website uses data from{" "}
          <a href='https://theyworkforyou.com' className='underline'>
            TheyWorkForYou
          </a>
          ,{" "}
          <a href='https://developer.parliament.uk' className='underline'>
            the UK Parliament API
          </a>{" "}
          and{" "}
          <a href='https://postcodes.io' className='underline'>
            Postcodes.io
          </a>
          .
        </p>
      </div>
    </main>
  );
}
